# Changelog

All notable changes to `ttkdl-cli` will be documented in this file.  
This file is intended to help users and contributors quickly understand what has been added, changed, or fixed in each release.

## [1.0.1] - 2025-11-16 (Current)

### Added
- New global flag `-v / --version` to display the current CLI version.
- Support for different TikTok URL formats, including:
  - `https://vm.tiktok.com/...`
  - `https://vt.tiktok.com/...`
  - `https://www.tiktok.com/@username/video/<id>`

### Changed
- Reorganized CLI help output: moved some flags from "Download options" to a new "Global options" section.
- Updated README:
  - Added a "Global commands" section.
  - Updated "Usage" examples to reflect different URL formats.
  - Added a note in "Features" about support for multiple TikTok URL formats.

### Fixed
- Updated some text colors to gray where it wasn't applied yet.
- Updated `postinstall` script to use `console.log` instead of `process.stdout.write`.
- Removed extra trailing spaces in terminal messages.

---

## [1.0.0] - 2025-11-14

### Added
- First release of `ttkdl-cli` with support for the following commands:
  - Download videos from valid TikTok URLs
  - Configure default save location (`config -r`)
  - Download options `-o / --output`, `-m / --max`
  - Global options `-h / --help`