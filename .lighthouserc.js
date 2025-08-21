module.exports = {
  ci: {
    collect: {
      staticDistDir: "_site",
      url: [
        "http://localhost:8080/",
        "http://localhost:8080/services/ventousage/",
        "http://localhost:8080/services/securite-gardiennage/",
        "http://localhost:8080/services/convoyage/",
        "http://localhost:8080/realisations/",
        "http://localhost:8080/contact/",
        "http://localhost:8080/mentions/"
      ],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        "performance": ["error", { "minScore": 0.85 }],
        "accessibility": ["error", { "minScore": 0.90 }],
        "seo": ["error", { "minScore": 0.90 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    upload: { target: "temporary-public-storage" }
  }
};