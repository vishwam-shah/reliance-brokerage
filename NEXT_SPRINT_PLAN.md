# Next Sprint Implementation Plan
**Sprint Duration:** 1-2 weeks  
**Target:** Medium-priority improvements & Quality Assurance

---

## 📋 SPRINT BACKLOG (6 Items)

### **Item 1: Refactor Inline Event Handlers**
**Effort:** 3 hours  
**Priority:** Medium  
**Current State:** `onmouseenter`, `onmouseleave`, `onsubmit` scattered throughout HTML

**Files to Refactor:**
- index.html (10+ inline handlers)
- listings.html (5+ inline handlers)
- about.html (3+ inline handlers)
- Various card hover effects

**Action Plan:**
1. Create `assets/js/event-handlers.js`
2. Move all hover effects to delegated event listeners
3. Move form submits to JS
4. Test on all affected pages
5. Verify hover states still work

**Benefits:**
- ✅ Better maintainability
- ✅ CSP (Content Security Policy) compliance
- ✅ Cleaner HTML
- ✅ Easier to debug

**Definition of Done:**
- [ ] No inline event handlers in HTML
- [ ] All functionality preserved
- [ ] Works on touch devices
- [ ] No console errors

---

### **Item 2: Add SEO Meta Tags**
**Effort:** 2 hours  
**Priority:** Medium  
**Current State:** Missing og:image, twitter:card tags on portal pages

**Files to Update:**
- portal/dashboard.html
- portal/listing-management.html
- portal/inquiry-management.html
- portal/listing-analytics.html
- portal/secure-vault.html
- portal/permissions.html
- listing-detail.html

**Tags to Add:**
```html
<meta property="og:image" content="[image URL]">
<meta property="og:type" content="website">
<meta property="og:url" content="[page URL]">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="[image URL]">
```

**Action Plan:**
1. Create base meta tags for each page
2. Update head on all pages
3. Test with OG debugger
4. Verify LinkedIn/Twitter preview
5. Add dynamic og:image if possible

**Benefits:**
- ✅ Better social sharing
- ✅ Improved click-through rates
- ✅ Professional appearance on social media
- ✅ SEO improvement

**Definition of Done:**
- [ ] og: tags on all pages
- [ ] twitter: tags on all pages
- [ ] OG debugger preview works
- [ ] No 404s on linked images

---

### **Item 3: Implement Font Preloading**
**Effort:** 1 hour  
**Priority:** Medium  
**Current State:** Using preconnect, but not preload

**Action Plan:**
1. Add preload for Noto Serif (headline font)
2. Add preload for Manrope (body font)
3. Add font-display: swap for fallback
4. Test font rendering on slow 3G
5. Measure CLS impact

**Changes to index.html:**
```html
<!-- Add to head -->
<link rel="preload" as="font" href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700;900&display=swap" crossorigin>
<link rel="preload" as="font" href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&display=swap" crossorigin>
```

**Benefits:**
- ✅ -200-500ms faster font display
- ✅ Reduced Cumulative Layout Shift (CLS)
- ✅ Better Core Web Vitals score
- ✅ Professional appearance maintained

**Definition of Done:**
- [ ] Font preload added to head
- [ ] No layout shift on page load
- [ ] Fonts render before content
- [ ] Lighthouse score improves

---

### **Item 4: Optimize Images Further**
**Effort:** 2 hours  
**Priority:** Medium  
**Current State:** Good, but missing 1600w breakpoint

**Action Plan:**
1. Add 1600w breakpoint to hero images (for 4K)
2. Consider WebP format support
3. Add LQIP (Low Quality Image Placeholder)
4. Optimize Unsplash query params
5. Test on slow connection

**Files to Update:**
- index.html (2 hero images)
- about.html (team photo)
- listings.html (listing cards)
- listing-detail.html (detail images)

**New Srcset Example:**
```html
srcset="...w=400... 400w, ...w=600... 600w, ...w=900... 900w, ...w=1200... 1200w, ...w=1600... 1600w"
```

**Benefits:**
- ✅ Better 4K display support
- ✅ Faster load on mobile
- ✅ WebP can save 25-30% bandwidth
- ✅ Better Core Web Vitals

**Definition of Done:**
- [ ] All images optimized
- [ ] 1600w breakpoint added
- [ ] WebP tested (if added)
- [ ] Lighthouse image audit passes

---

### **Item 5: Fix Translation Race Condition**
**Effort:** 1 hour  
**Priority:** Medium  
**Current State:** Both main.js and lang-switcher.js load translations

**Action Plan:**
1. Remove translation loading from main.js
2. Keep only in lang-switcher.js
3. Add error handling with fallback
4. Test language switching thoroughly
5. Check console for errors

**Changes:**
- Remove fetch from main.js
- Add error boundary to lang-switcher.js
- Add fallback to English if load fails

**Code Change:**
```javascript
// In lang-switcher.js - add error handling
.catch(err => {
  console.error('Translation load failed:', err);
  translations = { en: {}, zh: {} };
  applyLanguage('en');
  SovToast('Language support temporarily unavailable', 'warning');
});
```

**Benefits:**
- ✅ No race conditions
- ✅ Better error handling
- ✅ Cleaner code
- ✅ Easier debugging

**Definition of Done:**
- [ ] Single loading point
- [ ] Error handling works
- [ ] Language toggle functional
- [ ] No console errors

---

### **Item 6: Full WCAG Accessibility Audit**
**Effort:** 3 hours  
**Priority:** High (should be in this sprint)  
**Current State:** A- level, need AA compliance

**Tools Needed:**
- axe DevTools (browser extension)
- Lighthouse audit
- WAVE WebAIM
- Manual keyboard testing

**Action Plan:**
1. Install axe DevTools on Chrome
2. Run on each page (10 pages)
3. Document all violations
4. Fix priority issues (contrast, labels)
5. Test with screen reader
6. Test keyboard navigation
7. Generate accessibility report

**Common Issues to Check:**
- ✅ Color contrast (4.5:1 for normal text)
- ✅ Missing alt text
- ✅ Proper heading hierarchy
- ✅ Form labels associated
- ✅ Focus management
- ✅ Keyboard accessibility
- ✅ ARIA attributes correct

**Estimated Violations:** 5-10 (most likely contrast-related)

**Definition of Done:**
- [ ] axe DevTools: 0 critical violations
- [ ] axe DevTools: <5 serious violations
- [ ] Lighthouse accessibility score: 95+
- [ ] Manual keyboard test: passes
- [ ] Screen reader test: functional

---

## 📊 SPRINT ESTIMATE

| Item | Effort | Risk | Notes |
|------|--------|------|-------|
| Inline handlers | 3h | Low | Straightforward refactor |
| SEO meta tags | 2h | Low | Copy-paste task |
| Font preload | 1h | Low | One-time setup |
| Image optimization | 2h | Low | Adding srcset params |
| Translation race condition | 1h | Low | Consolidation |
| WCAG audit | 3h | Medium | Depends on findings |
| **TOTAL** | **12h** | | **2-3 days of work** |

---

## 🎯 ACCEPTANCE CRITERIA

### Before Sprint Ends:
- ✅ All inline event handlers refactored
- ✅ SEO meta tags added to all pages
- ✅ Font preloading implemented
- ✅ 1600w image breakpoints added
- ✅ Translation loading consolidated
- ✅ WCAG audit completed
- ✅ Accessibility report generated

### Quality Gates:
- ✅ Lighthouse score: 90+
- ✅ Accessibility score: 95+
- ✅ No new console errors
- ✅ All pages responsive
- ✅ Cross-browser tested (Chrome, Firefox, Safari)
- ✅ Mobile tested (iOS, Android)

---

## 🚀 DEPLOYMENT PLAN

**After Sprint Completion:**
1. Deploy to staging server
2. Run full QA testing
3. User acceptance testing
4. Performance monitoring
5. Deploy to production

**Estimated Timeline:**
- Sprint: 2-3 days of work
- QA: 1-2 days
- UAT: 1 day
- Production: 1 day
- **Total: 1 week**

---

## 📈 SUCCESS METRICS

After this sprint, metrics should be:

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Lighthouse Score | 75-80 | 90+ | +15-20 points |
| Accessibility | 85-90 | 95+ | +5-10 points |
| WCAG Compliance | A- | AA | Full AA compliance |
| Font Rendering | ~800ms | ~300ms | -500ms faster |
| Image Load Time | Standard | Optimized | -20-30% |
| Form Completion | ~70% | ~95% | +25% (due to validation) |

---

## 🔍 QA CHECKLIST

**Before Marking Sprint Done:**

### Functionality
- [ ] All links work (no 404s)
- [ ] Portal navigation functional
- [ ] Forms submit successfully
- [ ] Language switching works
- [ ] No console errors

### Performance
- [ ] Lighthouse: 90+
- [ ] Page load: <3s
- [ ] First Contentful Paint: <1.5s
- [ ] Largest Contentful Paint: <2.5s

### Accessibility
- [ ] axe DevTools: 0 critical
- [ ] Keyboard navigation: works
- [ ] Screen reader: functional
- [ ] Color contrast: WCAG AA
- [ ] All images have alt text

### Responsiveness
- [ ] Mobile: 375px width
- [ ] Tablet: 768px width
- [ ] Desktop: 1280px width
- [ ] All pages responsive

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Devices
- [ ] iPhone (iOS 15+)
- [ ] Samsung (Android 12+)
- [ ] iPad (if applicable)

---

## 📞 ESCALATION CONTACTS

If stuck on any item:
1. **Inline handlers:** Check existing patterns in main.js
2. **SEO tags:** Use og-image.xyz for preview
3. **Font preload:** Refer to Google Fonts docs
4. **Image optimization:** Use Unsplash format params
5. **Translation race:** Check lang-switcher.js load logic
6. **WCAG audit:** Use axe DevTools help section

---

## ✅ SIGN-OFF

**Sprint Lead:** TBD  
**QA Lead:** TBD  
**Target Start Date:** Next Monday  
**Target End Date:** Next Friday  

**Readiness:** ✅ Ready to start

---

**Document:** Sprint Planning  
**Version:** 1.0  
**Last Updated:** April 13, 2026
