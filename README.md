<h1 align="center">
   Tiktok-dl CLI
</h1>

<p align="center">
   <img alt="Repository size" src="https://img.shields.io/github/repo-size/ThiagoBRG60/tiktok-dl?style=flat-square&color=FF005A"/>
   <img alt="Npm version" src="https://img.shields.io/npm/v/tiktok-dl?style=flat-square&color=FF005A"/>
   <a href="https://github.com/ThiagoBRG60/tiktok-dl/stargazers">
      <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/ThiagoBRG60/tiktok-dl?style=flat-square&color=FF005A"/>
   </a>
   <a href="https://github.com/ThiagoBRG60/tiktok-dl/network/members">
      <img alt="GitHub forks" src="https://img.shields.io/github/forks/ThiagoBRG60/tiktok-dl?style=flat-square&color=00FFFF"/>
   </a>
   <img alt="Npm downloads" src="https://img.shields.io/npm/dt/tiktok-dl?style=flat-square&color=00FFFF"/>
   <a href="https://github.com/ThiagoBRG60/tiktok-dl/tree/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/ThiagoBRG60/tiktok-dl?style=flat-square&color=00FFFF"/>
   </a>
   <a href="https://nodejs.org/">
      <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-blue?style=flat-square&color=00FFFF"/>
   </a>
</p>

## 📝 Description

Tiktok-dl is a lightweight command-line tool for downloading TikTok videos directly from one or more URLs. It lets you configure download paths, control concurrent download limits, and set persistent default folders for saving videos across sessions.


## 🚀 Features

- Download single or multiple TikTok videos from URLs.
- Support for concurrent downloads (up to 5 videos at a time).
- Custom output paths for single downloads or persistent default save folders.
- Easy-to-use command-line interface.

## 💻 Technologies

- Node.js (runtime for the CLI)
- JavaScript (ES Modules)

## ⚙️ Prerequisites

Before using the CLI, make sure you have installed:

- **Node.js** (version 18.x or higher)
- **npm** (Node.js package manager)

To check if you have Node.js and npm installed, run:

```bash
node -v
npm -v
```

If you don't have Node.js installed, you can download it here: https://nodejs.org.

## 🛠️ Installation

You can run the CLI either by installing it globally or using `npx`:

### Global Installation

```bash
npm install -g tiktok-dl
```

After installing, the `ttkdl` command will be available globally in your terminal.

### Using npx (without installing)

```bash
npx tiktok-dl "https://vt.tiktok.com/example"
```

## 📖 Usage

### Single Download

Download a single TikTok video:

```bash
ttkdl "https://vt.tiktok.com/example"
```

### Multiple Downloads

Download multiple videos at once:

```bash
ttkdl "https://vt.tiktok.com/example-1" "https://vt.tiktok.com/example-2"
```

### Custom Output Path

Specify a custom save location for a single download session:

```bash
ttkdl "https://vt.tiktok.com/example-1" "https://vt.tiktok.com/example-2" -o "./my/folder"
```

### Maximum Concurrent Downloads

Set the number of videos to download simultaneously (max: 5):

```bash
ttkdl "https://vt.tiktok.com/example-1" "https://vt.tiktok.com/example-2" -m 5
```

### Default Save Location

Configure a persistent default folder for all downloads:

```bash
ttkdl config -r "C:/default/videos/folder"
```

## 🎯 Command Reference

### Download Commands

```
ttkdl <urls> [options]
```

| Arguments / Options   | Description                                                         | Default             |
|-----------------------|---------------------------------------------------------------------|---------------------|
| `<urls>`              | One or more valid TikTok URLs (e.g., https://vt.tiktok.com/example) | —                   |
| `-o, --output <path>` | Sets the save path for videos (one-time, optional)                  | User home directory |
| `-m, --max <number>`  | Sets the number of videos to download simultaneously (max 5)        | 3                   |
| `-h, --help`          | Shows the help message                                              | —                   |

### Configuration Commands

```
ttkdl config [options]
```

| Arguments / Options    | Description                                                     | Default             |
|------------------------|---------------------------------------------------------------- |---------------------|
| `-r, --root <path>`    | Sets the default folder where videos will be saved (persistent) | User home directory |

## 🤝 Contributing

Contributions are welcome! To contribute to the project, follow these steps:

1. Fork the repository.
   
2. Create a branch for your feature or change: `git checkout -b your-branch-name`.
   
3. Make your changes, add and commit: `git add .` and `git commit -m 'commit message'`.
   
4. Push your changes to the forked repository: `git push origin your-branch-name`.
   
5. Create a pull request on GitHub to the main repository.

<br/>

💡 If you find a bug or have a feature request, please open an [`Issue`](https://github.com/ThiagoBRG60/tiktok-dl/issues) on GitHub.

## 📬 Contact

If you have any questions, feel free to contact me via email:

<a href="mailto:thiagocorreadev@gmail.com" title="Gmail">
   <img src="https://img.shields.io/badge/-Gmail-FF0000?style=flat-square&labelColor=FF0000&logo=gmail&logoColor=white" alt="Gmail"/>
</a>

## 📄 License

This project is licensed under the MIT License. See the [`LICENSE`](LICENSE) file for more details.

<br>

⭐ If this project helped you, consider leaving a star on the repository!