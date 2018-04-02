declare module 'favicons' {
	interface FaviconsFile {
		name: string,
		contents: string|Buffer,
	}
	export interface FaviconsResponse {
		files: FaviconsFile[];
		images: FaviconsFile[];
		html: string[];
		elements: JSX.Element[];
	}
	function favicons(
		sourceFile: string,
		configuration: object,
		callbacks: (err: Error|null, response: Partial<FaviconsResponse>) => void,
	): void;
	export default favicons
}
