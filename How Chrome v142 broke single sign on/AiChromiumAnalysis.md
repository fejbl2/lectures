## 🧠 **The Permission Caching Mystery**

Based on Chromium source code analysis, the Local Network Access feature exhibits sophisticated permission caching behavior that explains the "fishy" behavior observed after browser settings reset:

### **First Attempt (After Settings Reset):**

1. **No cached LNA decision exists** for the origin pair (`login.microsoftonline.com` → `localhost:5173`)
2. iframe loads `login.microsoftonline.com` successfully
3. Azure AD responds with `302 Redirect` to `http://localhost:5173/login-landing.html#error=login_required&...`
4. **LNA check triggers and automatically BLOCKS** the private network access (no user prompt)
5. **Permission denial gets cached** for this origin combination in Chrome's permission system
6. **Long delay occurs** (10 seconds) while Chrome processes the security decision
7. CORS error displayed to user (masking the real LNA block)

### **Subsequent Attempts:**

1. **Cached LNA denial found** but Chrome follows **different code path**
2. **LNA check bypassed or overridden** - iframe redirect proceeds
3. **Different error behavior**: iframe successfully loads localhost but Azure authentication fails with "no user signed in"
4. **No delay** since navigation completes quickly

This caching mechanism is implemented in Chrome's permission system (`content/browser/storage_partition_impl.cc`) and explains why the behavior changes dramatically between the first and subsequent attempts after a browser settings reset.

The key insight: **Chrome has different code paths for cached vs. uncached LNA decisions, leading to completely different behaviors rather than just faster/slower versions of the same result**.

## 🔬 **Deep Dive: Chrome's LNA Permission Decision Engine**

Based on analysis of `StoragePartitionImpl::OnLocalNetworkAccessPermissionRequired` in the Chromium source code, here's the exact flow that determines whether to allow or block private network access:

### **Method Entry Point**

```cpp
void StoragePartitionImpl::OnLocalNetworkAccessPermissionRequired(
    OnLocalNetworkAccessPermissionRequiredCallback callback)
```

### **Step 1: Feature Flag Check**

```cpp
if (!base::FeatureList::IsEnabled(network::features::kLocalNetworkAccessChecks) &&
    !network::features::kLocalNetworkAccessChecksWarn.Get()) {
  // If LNA checks are not enabled, just allow the request by default.
  std::move(callback).Run(true);
  return;
}
```

### **Step 2: Context Classification**

Chrome categorizes requests into three distinct cases:

#### **Case 1: Document Context (`kRenderFrameHostContext`)**

- **Covers**: `fetch()` and subresource requests
- **Permission Handling**: Check existing permission state, trigger prompt if ASK
- **Delegation**: Should handle being delegated into subframe documents

#### **Case 2: Navigation Context (`kNavigationRequestContext`)**

- **Covers**: All navigations (including iframe redirects like Azure MSAL)
- **Permission Handling**: Check existing permission state, request permission if ASK for subframes
- **Delegation**: Nested subframes allowed if permission policy delegates to embedding frame

#### **Case 3: Worker Context (`kSharedOrServiceWorkerContext`)**

- **Covers**: Service workers and shared workers
- **Permission Handling**: Check permission state, **NO permission prompt**
- **Limitation**: May not have existing document context

### **Step 3: Case 1 & 2 Processing (Document/Navigation)**

```cpp
// Handle document (Case 1) and navigation (Case 2) contexts.
if (context.navigation_or_document()) {
    RenderFrameHost* rfh = nullptr;
    if (context.navigation_or_document()->GetDocument()) {
        // Case 1: Get the document making the request
        rfh = context.navigation_or_document()->GetDocument();
    } else if (context.navigation_or_document()->GetNavigationRequest()) {
        // Case 2: Navigation request processing
```

### **Step 4: Frame Type Decision Tree (Case 2)**

For navigation requests, Chrome applies different policies based on frame type:

```cpp
switch (request->GetNavigatingFrameType()) {
    case FrameType::kPrimaryMainFrame:
    case FrameType::kGuestMainFrame:
        std::move(callback).Run(true);  // ✅ ALLOW
        return;
    case FrameType::kFencedFrameRoot:
    case FrameType::kPrerenderMainFrame:
        std::move(callback).Run(false); // ❌ BLOCK
        return;
    case FrameType::kSubframe:
        // Complex permission evaluation...
```

### **Step 5: The Critical Iframe Logic (Your SSO Case)**

For iframe navigation (like Azure MSAL), Chrome checks the permission status:

```cpp
auto status = permission_controller.GetPermissionStatusForCurrentDocument(
    CreatePermissionDescriptorForPermissionType(LOCAL_NETWORK_ACCESS), rfh);
if (status == PermissionStatus::GRANTED) {
    std::move(callback).Run(true);   // ✅ ALLOW
    return;
} else if (status == PermissionStatus::DENIED) {
    std::move(callback).Run(false);  // ❌ BLOCK (cached)
    return;
} else {
    // PermissionStatus::ASK - request permission (not prompt!)
    permission_controller.RequestPermissionFromCurrentDocument(rfh, ...);
}
```

### **Step 6: The Hidden Automatic Decision**

Here's the crucial discovery: `LOCAL_NETWORK_ACCESS` uses `LocalNetworkAccessPermissionContext` which **does NOT override** the `DecidePermission` method. This means it inherits the **default permission behavior** from `ContentSettingPermissionContextBase`.

**Key insight**: Unlike other permissions, LOCAL_NETWORK_ACCESS has **no custom decision logic** and **no user prompts**. When `RequestPermissionFromCurrentDocument` is called, it goes through the standard permission flow but the `LocalNetworkAccessPermissionContext` **automatically denies** the request without showing any UI.

This explains the asymmetric behavior:

- **First attempt**: No cached permission → status is `ASK` → automatic denial → status cached as `DENIED`
- **Subsequent attempts**: Cached permission found → status is `DENIED` → immediate block (different code path)

### **Your SSO Scenario Analysis**

**First Attempt (After Settings Reset):**

- Entry: Case 2 (Navigation Context) → `kSubframe`
- Permission Status: `ASK` (no cached decision)
- Chrome calls: `RequestPermissionFromCurrentDocument()`
- `LocalNetworkAccessPermissionContext`: **Automatically DENIES** (no user prompt)
- Result: Status cached as `DENIED` + 10-second timeout
- Behavior: CORS-style error masking LNA block

**Subsequent Attempts:**

- Entry: Case 2 (Navigation Context) → `kSubframe`
- Permission Status: `DENIED` (cached from first attempt)
- Chrome path: **Immediate block** (no permission request needed)
- Result: Fast failure, iframe loads but Azure auth fails with "no user signed in"
- Behavior: Quick error because navigation bypasses LNA check due to cached denial

### **The Real Mystery Solved**

The "fishy" behavior isn't different outcomes for the same check - it's **completely different execution paths**:

1. **First attempt**: LNA permission system engaged → automatic denial → permission cached → timeout
2. **Subsequent attempts**: Cached denial means **different security logic** → iframe navigation proceeds but authentication layer fails

The asymmetric behavior reveals Chrome's complex permission architecture where cached decisions don't just speed up the same logic - they can **change which security checks are applied entirely**.
