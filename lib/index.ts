import favicons, {FaviconsResponse} from 'favicons';
import fs from 'fs';
import path from 'path';
import React from 'react';
import sax from 'sax';

export interface ReactStaticFaviconsProps {
	outputDir: string;
	inputFile: string;
	configuration: object;
}

export default class ReactStaticFavicons {
	props: Readonly<ReactStaticFaviconsProps>;

	private cache?: FaviconsResponse & {
		src: Buffer
	};

	constructor(props: Readonly<ReactStaticFaviconsProps>) {
		this.props = props;
	}

	async render(): Promise<JSX.Element[]> {
		const {inputFile} = this.props;
		const {cache} = this;
		const src = fs.readFileSync(inputFile);
		if (cache && cache.src.equals(src)) {
			return cache.elements;
		}

		this.cache = undefined;
		const res = await this.build()
		this.cache = {...res, src};
		return res.elements;
	}

	private async build(): Promise<FaviconsResponse> {
		const {outputDir, inputFile, configuration} = this.props;
		return new Promise<FaviconsResponse>((resolve, reject) => {
			favicons(inputFile, configuration, (err, response) => {
				if (err) {
					reject(err);
					return;
				}

				const res: FaviconsResponse = {
					files:   [],
					images:   [],
					html:   [],
					elements: [],
					...response,
				};
				try {
					[...res.files, ...res.images].forEach(({name, contents}) => {
						fs.writeFileSync(path.join(outputDir, name), contents, {mode: 0o644})
					});

					res.html.forEach((s) => {
						const p = sax.parser(false, {lowercase: true});
						p.onopentag = (node) => {
							res.elements.push(React.createElement(node.name, {
								...node.attributes,
								key: `react-static-favicons--${res.elements.length}--${node.name}`,
							}));
						};
						p.write(s).close();
					});

					resolve(res);
				} catch (err) {
					reject(err);
				}
			});
		});
	}
}
