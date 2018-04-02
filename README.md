react-static/favicons
---------------------

A little helper to make working with [react-static](https://github.com/nozzle/react-static) and [favicons](https://github.com/haydenbleasel/favicons) easier.

Install
-------

```bash
yarn add @kuroku/react-static-favicons
```

Usage
-----


```javascript
// static.config.js


import ReactStaticFavicons from '@kuroku/react-static-favicons';

// keeping the instance global allows the favicons result to be cached
const reactStaticFavicons = new ReactStaticFavicons({
	// string: directory where the image files are written
	outputDir: path.join(__dirname, 'dist'),

	// string: the source image
	inputFile: path.join(__dirname, 'logo.svg'),

	// object: the configuration passed directory to favicons
	configuration: {
		icons: {
	        favicons: true,
	        // other favicons configuration
		}
	},
});

// react-static config
export default {
	renderToHtml: async (render, C, meta) => {
		meta.faviconsElements = await reactStaticFavicons.render();
		const html = render(<C />);
		return html;
	},
	Document: ({Html, Head, Body, children, siteData, renderMeta}) => (
		<Html>
			<Head>
				{renderMeta.faviconsElements}
			</Head>
		<Body>
			{children}
		</Body>
		</Html>
	),
}


```

