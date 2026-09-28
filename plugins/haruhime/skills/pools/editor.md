<!-- Details for SKILL.md's "Making a pool" (editor v2.1), summarized from pools.haruhime.moe's README and code in https://github.com/haruhimemoe/pools.haruhime.moe: src/constants/targets.ts, src/schemas/built-plan.ts, src/utils/undo.ts, src/utils/pool-export.ts, src/services/built-pool-activity.ts, src/hooks/useSlotDrag.ts and src/utils/map-preview.ts. Recheck this when they change. -->

# The pools editor

`/pools/<id>/edit`, for the pool's owner and editors. Everything below is live on pools.haruhime.moe (in beta).

## Templates on `/new`

A template sets how many maps each built-in slot should hold. It never adds maps, and the counts are common shapes, not rules: change them in the editor.

| Template | NM | HD | HR | DT | FM | TB |
| --- | --- | --- | --- | --- | --- | --- |
| Blank | | | | | | |
| Qualifiers | 5 | 2 | 2 | 3 | 2 | |
| Group stage | 6 | 3 | 3 | 4 | 3 | 1 |
| Knockout | 6 | 4 | 4 | 4 | 3 | 1 |
| Finals | 7 | 4 | 4 | 5 | 4 | 1 |

## Slot targets

- Each slot (built-in or custom) can have a target: how many maps it should hold, 0 to 16, and optionally a star range under the slot's mods (0 to 10, two decimals; give both ends or neither).
- The editor shows a placeholder row for each map still missing ("2 more NM maps") and a badge on a map whose stars under its slot's mods fall outside the range. The summary lists both.
- **Find maps** on a slot with a range opens the map browser with that range in the star filter.
- A count of 0 with no range clears the target. Removing a custom slot drops its target. Start from this pool copies targets.

## Slot notes

- One note per map, 1 to 280 characters on one line (no line breaks or control characters), checked against the same blocklist as names. Clearing the text removes it.
- A note follows its map when it moves and goes when the map does.
- It shows under the map in the editor and on the pool's page, so everyone who can see the pool reads it: the link holders of an unlisted pool, everyone for a public one. Visitors only see notes that pass today's filter, and Start from this pool copies only those.

## Map previews

Covers and osu!'s preview clips show in the map browser, the editor and built pool pages. The browser loads them straight from osu!'s servers (covers from assets.ppy.sh, clips from b.ppy.sh); pools never proxies or stores them. One clip plays at a time, and it stops when its button leaves the page.

## Undo

- The Undo button, or Ctrl+Z / Cmd+Z outside a text field, takes back your own last change in this session, up to 20 steps. There is no redo.
- An undo is sent as a change of its own (the inverse), so it saves, reaches your co-editors and shows in Recent changes.
- Someone else's change clears your history, since steps name slots by place. An undo that meets someone else's change is dropped with a notice. A change that can't be inverted exactly has no undo.

## Export

On a built pool's page and in the editor, made in the browser from what the page shows (nothing is fetched):

- **Copy beatmap IDs:** one line per map, its slot label and beatmap ID, in slot order.
- **Copy !mp lines:** per slot, `!mp map <id> 0` (0 is osu!standard) then `!mp mods` with the slot's mods: `None` for a no-mod slot (it clears a room's leftover mods), the forced acronyms, or `Freemod` for FM, TB and freemod slots. Slots are a blank line apart.
- **Download CSV:** columns Slot, Beatmap ID, Set ID, Artist, Title, Version, Mapper, Stars (with mods), Length (s), BPM, AR, OD and CS, with values under each slot's mods and blanks where they aren't known. UTF-8 that Excel reads, and no cell can start a spreadsheet formula.

## Recent changes

The editor lists the pool's last 20 changes: who made each, when and what. Only the owner and editors see it. A pool keeps its last 200 changes for up to 180 days. Deleting an account renames its entries to "deleted user"; deleting a pool deletes its log.

## Drag and drop

Drag a map by the handle at the top of its row, with a mouse, a finger or a pen. Dropping it on a row takes that row's place; dropping it on another slot puts it at that slot's end. The Up, Down and "Move to" buttons stay for the keyboard, and focus follows the moved map. A drop moves the map you picked up, even if a save or a co-editor changed the pool during the drag.
