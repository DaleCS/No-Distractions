# No Distractions - Web Blocker

A Mozilla Firefox web extension that temporarily prevents your browser from navigating to websites that could distract you from your work.

Social media's abundant content and attention grabbing designs have made it very tempting to peek from time to time which compromises our ability to focus on our tasks. At least, that's how I feel. So I've created a web extension that redirects your browser whenever you try to visit social media websites to keep your attention focused on your tasks.

Mozilla Firefox, JavaScript, React, HTML, CSS

# How to set up development environment

1. After cloning from GitHub, open terminal and cd to directory.
2. Run `npm run install` from the main directory to install React dependencies in the `/popup` folder.
3. Run `npm run build` from the main directory to create a build.
4. Open Firefox browser and navigate to `about:debugging` using the search bar.
5. Click `Load temporary Add-on...` and use the `manifest.json` file in the `/build` folder.
