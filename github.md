## Authenticating GitHub with SSH keys

- Basically just create SSH keys following tutorials on [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
- Adding it to GitHub
- Add this line to `.bashrc`
  ```bash
  # To make GPG work
  export GPG_TTY=$(tty)
  ```
