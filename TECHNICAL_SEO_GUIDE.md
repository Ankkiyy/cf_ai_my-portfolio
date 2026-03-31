# Ankkiyy Technical SEO Implementation Guide

**Objective**: Ensure optimal crawlability, indexing, and performance for Google Search recognition

---

## 1. SITEMAP.XML STRATEGY

### Primary Sitemap (ankkiyy.com/sitemap.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  
  <!-- Homepage (Highest Priority) -->
  <url>
    <loc>https://ankkiyy.com/</loc>
    <lastmod>2026-03-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Service Pages -->
  <url>
    <loc>https://ankkiyy.com/about</loc>
    <lastmod>2026-03-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://ankkiyy.com/projects</loc>
    <lastmod>2026-03-29</lastmod>
    <changefreq>biweekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://ankkiyy.com/case-studies</loc>
    <lastmod>2026-03-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://ankkiyy.com/certificates</loc>
    <lastmod>2026-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://ankkiyy.com/clients</loc>
    <lastmod>2026-03-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Blog Posts (High Priority) -->
  <url>
    <loc>https://ankkiyy.com/blog/penetration-testing-guide-ankkiyy</loc>
    <lastmod>2026-04-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://ankkiyy.com/images/penetration-testing.jpg</image:loc>
      <image:title>Penetration Testing Guide by Ankkiyy</image:title>
    </image:image>
  </url>
  
  <!-- Secondary Pages -->
  <url>
    <loc>https://ankkiyy.com/tools</loc>
    <lastmod>2026-03-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>https://ankkiyy.com/contact</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Meta Pages -->
  <url>
    <loc>https://ankkiyy.com/privacy</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  
  <url>
    <loc>https://ankkiyy.com/terms</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

### Implementation Steps:
1. Generate sitemap.xml via code (React component or static generation)
2. Add to public folder (`/public/sitemap.xml`)
3. Update robots.txt with sitemap location
4. Submit to Google Search Console
5. **Update cadence**: Regenerate monthly or when new content added

---

## 2. HREFLANG STRATEGY (Multi-Domain)

### For ankkiyy.com ↔ ankkiyy.uk

**Homepage (ankkiyy.com/)**:
```html
<link rel="alternate" hreflang="en-GB" href="https://ankkiyy.uk/" />
<link rel="canonical" href="https://ankkiyy.com/" />
```

**About Page (ankkiyy.com/about)**:
```html
<link rel="alternate" hreflang="en-GB" href="https://ankkiyy.uk/about" />
<link rel="canonical" href="https://ankkiyy.com/about" />
```

**Purpose**: Tell Google they're alternate versions, prevent duplicate content issues

---

## 3. ROBOTS.META TAGS (Per-Page Override)

### Default for publicly indexable pages:
```html
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
```

### Pages to NOINDEX (if applicable):
```html
<!-- Private/Admin pages -->
<meta name="robots" content="noindex, nofollow" />

<!-- Duplicate content (if not using canonical):
<meta name="robots" content="noindex, follow" />
```

---

## 4. STRUCTURED DATA CHECKLIST

### Implemented ✅
- [ ] Person Schema (Ankkiyy)
- [ ] Organization Schema
- [ ] WebSite Schema
- [ ] Breadcrumb Schema (on subpages)
- [ ] Article Schema (on blog posts)

### To Implement ⏳
- [ ] ProductCollection Schema (for projects)
- [ ] LocalBusiness Schema (when adding location)
- [ ] BreadcrumbList Schema (all subpages)
- [ ] FAQPage Schema (if adding FAQ section)

### Validation:
- Use Rich Results Tester: https://search.google.com/test/rich-results
- Use Schema.org validator: https://www.schema.org/

---

## 5. CORE WEB VITALS OPTIMIZATION

### Current Targets:
```
Largest Contentful Paint (LCP): < 2.5s
Cumulative Layout Shift (CLS): < 0.1
First Input Delay (FID): < 100ms
```

### Optimization Checklist:
- [ ] Images: Use WebP with JPEG fallback
- [ ] CSS: Minify + inline critical CSS
- [ ] JavaScript: Code split, lazy load routes
- [ ] Fonts: Preload, system fallbacks
- [ ] Caching: Set proper cache headers
- [ ] CDN: Use CDN for static assets

### Monitoring:
- Google PageSpeed Insights
- WebPageTest.org
- Lighthouse (in DevTools)

---

## 6. CANONICAL TAG STRATEGY

### Homepage canonical:
```html
<link rel="canonical" href="https://ankkiyy.com/" />
```

### Policy:
- Every page has ONE canonical
- Canonical is always HTTPS
- Primary domain (ankkiyy.com) is canonical
- Self-referential on most pages
- Use hreflang for alternate languages

---

## 7. MOBILE-FIRST INDEXING CHECKLIST

Google now primarily crawls mobile version. Ensure:
- [ ] Mobile viewport meta tag present
- [ ] Touch-friendly buttons (48x48px minimum)
- [ ] No interstitials blocking content
- [ ] Text readable without zooming
- [ ] Fast mobile performance (target: LCP <2.5s on mobile)
- [ ] No Flash (outdated)
- [ ] No render-blocking resources on mobile

---

## 8. INTERNAL LINKING STRUCTURE FOR "ANKKIYY" RECOGNITION

### Authority Flow (Homepage → Inner Pages):

```
Homepage (1.0 authority)
├── About page (0.9 authority)
│   ├── Certificates (0.8)
│   └── Experience section
├── Projects (0.8 authority)
│   ├── Individual projects (0.7)
│   └── GitHub link (external PR)
├── Case Studies (0.8 authority)
│   ├── Success metrics (0.7)
│   └── Client testimonials
└── Blog (0.7 authority)
    ├── Article 1 (0.6)
    ├── Article 2 (0.6)
    └── Article 3 (0.6)

Linking Principle:
- Every inner page links back to Home (strategic)
- Every inner page links to About (authority)
- Every page mentions "Ankkiyy" naturally in anchor text
```

### Anchor Text Strategy:
```
✅ Use variation:
- "learn more about Ankkiyy"
- "Ankkiyy's approach"
- "according to Ankkiyy"
- "Ankkiyy recommends"
- "Ankkiyy's expertise"

❌ Avoid:
- "click here"
- "read more"
- Exact match anchors (too many times)
```

---

## 9. METADATA CONSISTENCY

### Brand Consistency Checklist:

1. **Name Format**:
   - Always "Ankkiyy" (not "ankkiyy", not "ANKKIYY")
   - Consistent across all tags

2. **Email Consistency**:
   - Always "me@ankkiyy.com"
   - All contact forms use this email

3. **URL Structure**:
   - Primary: ankkiyy.com
   - Secondary: ankkiyy.uk (with hreflang)
   - No www subdomain (www.ankkiyy.com should redirect to ankkiyy.com)

4. **Social Profile URLs**:
   - GitHub: https://github.com/ankkiyy (consistent)
   - X: https://x.com/ankkiyy (consistent)
   - YouTube: https://youtube.com/@ankkiyy (consistent)
   - LinkedIn: https://linkedin.com/in/ankkiyy (or similar)

---

## 10. CRAWLABILITY TESTING

### Google Search Console Crawl Test:
1. GSC → URL Inspection tool
2. Enter critical URLs
3. Check "Inspect URL" →  "Test live URL"
4. Look for:
   - ✅ "URL is indexable"
   - ✅ Mobile-friendly
   - ✅ Core Web Vitals: Good
   - ❌ Any warnings

### Tools:
- Screaming Frog (crawl your entire site)
- SEMrush Site Audit
- Ahrefs Site Audit

---

## 11. INDEXING STATUS MONITORING

### Weekly GSC Check:
```
Google Search Console > Coverage
- Indexed pages: [X]
- Excluded: [X]
- Errors: [X] (should be 0)
- Valid: [X] (should be 100%)
```

### Troubleshooting:
- "Discovered - not indexed" → Wait, increase internal links
- "Requested indexing" → Use GSC URL inspection tool
- "Excluded by robots.txt" → Check robots.txt, ensure important pages are allowed
- "Soft 404" → Check page actually exists

---

## 12. HTTPS & SECURITY HEADERS

### Verify:
- [ ] All pages HTTPS (enforce with 301 redirect from HTTP)
- [ ] SSL certificate valid (no warnings)
- [ ] Security headers set:
  - `Strict-Transport-Security: max-age=31536000`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `Content-Security-Policy: [your policy]`

---

## 13. CONTENT PUBLISHING WORKFLOW (Schema & Meta)

### Before Publishing Article:

```
[ ] Article written (2500+ words)
[ ] Title optimized (50-60 chars, keyword in first 5 words)
[ ] Meta description written (150-160 chars, keyword included)
[ ] Slug optimized (use hyphens, lowercase)
[ ] H1 tag matches title
[ ] H2-H4 structure created
[ ] Images optimized (WebP, 1200x630px featured)
[ ] Image alt text includes keyword
[ ] Internal links added (3-5 relevant)
[ ] Article schema added (type: Article)
[ ] Author schema added (Person: Ankkiyy)
[ ] Published date added (ISO 8601)
[ ] Updated date set (on updates)
[ ] Featured image set
[ ] Excerpt/summary written
[ ] Category assigned (if applicable)
[ ] Tags assigned (3-5 relevant)
[ ] URL slug confirmed
[ ] Preview: Check canonicalization
[ ] Mobile responsive check
[ ] Link checker: No broken links
[ ] Lighthouse score: 90+
[ ] SEO score: 90+ (if using tools)
[ ] GSC URL inspection: Pass
[ ] Publish!
```

---

## 14. MONITORING & ALERTS

### Set Up Google Search Console Alerts:
- Coverage issues (errors, excluded pages)
- Mobile usability issues
- Security issues (hacking, malware)
- AMP errors (if using AMP)
- Rich results warnings

### Manual Weekly Checks:
- [ ] GSC Coverage: Any new errors?
- [ ] GSC Performance: Ranking/impression changes?
- [ ] Ahrefs: New backlinks?
- [ ] Lighthouse: Performance changes?
- [ ] 404 errors: Any broken links?

---

## 15. ANNUAL SEO AUDIT CHECKLIST

**Every January, conduct:

### On-Page Audit
- [ ] All meta titles < 60 chars, keyword included
- [ ] All meta descriptions 150-160 chars
- [ ] H1 present on every page
- [ ] Keyword density 1-3% (natural)
- [ ] Internal link structure optimal
- [ ] Image optimization complete

### Technical Audit
- [ ] Lighthouse scores 90+
- [ ] Core Web Vitals all "Good"
- [ ] No crawl errors
- [ ] 0 broken links
- [ ] SSL/HTTPS everywhere
- [ ] Mobile responsive

### Backlink Audit
- [ ] Toxic backlinks identified + disavowed
- [ ] Competitor backlink analysis
- [ ] New link opportunities identified
- [ ] Link velocity healthy (no spikes)

### Content Audit
- [ ] Thin content identified (< 300 words)
- [ ] Outdated info refreshed
- [ ] Top 10 performing keywords
- [ ] Content gaps identified

---

## QUICK IMPLEMENTATION CHECKLIST (Week 1)

- [ ] Update index.html schema (DONE)
- [ ] Add hreflang tags to all pages
- [ ] Create sitemap.xml
- [ ] Update robots.txt
- [ ] Submit sitemap to GSC
- [ ] Run Lighthouse audit
- [ ] Fix critical Core Web Vitals issues
- [ ] Verify rich results in tester
- [ ] Create internal linking strategy
- [ ] Set up GSC alerts

---

**Owner**: Technical SEO Lead
**Last Review**: March 2026
**Next Review**: June 2026 (Quarterly)
