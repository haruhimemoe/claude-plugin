---
type: llm
---

PASS if the reply says all three: the entry goes under `## [Unreleased]` in an `### Added` section, written for the person using the package (what the option does); the next release is 0.3.0, not 0.2.1, because on 0.x a new option is a minor and patches hold only fixes; and released entries are never edited.
FAIL if it puts the entry under a new version heading right away, invents a section name, or says 0.2.1.
