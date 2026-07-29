# EGRelay

The main landing page for [egrelay.com](https://egrelay.com).

## Deploying on GitHub Pages

1. Create a public repository named exactly `phrasing0870.github.io`.
2. Upload every file and folder from this package to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then save.
6. In **Custom domain**, enter `egrelay.com`.
7. Configure the domain's DNS records for GitHub Pages.
8. Enable **Enforce HTTPS** after GitHub provisions the certificate.

The included `CNAME` file must stay in the repository root.

## Tool links

The homepage expects these GitHub Pages project sites:

- `/image-tool/`
- `/password-generator/`
- `/ledger/`
- `/leak-check/`

When the user site uses `egrelay.com`, GitHub Pages serves those project repositories below the same custom domain.
