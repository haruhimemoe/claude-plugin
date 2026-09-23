---
type: llm
---

PASS if the reply explains that addSlot returns the same pool object when it refuses the edit, and names at least one real refusal condition from @haruhimemoe/pool: the pool already has 64 maps, the slot group reached number 99, or the bucket doesn't exist. It should suggest comparing the result to the old pool by reference.
FAIL if it blames a discarded return value, stale state or React, or gives only generic reasons without any of those conditions.
