const getGuidesRU = () => {
	const data = import.meta.globEager(`./guides/ru/*.md`);
	return data;
};

const getGuidesEN = () => {
	const data = import.meta.globEager(`./guides/en/*.md`);
	return data;
};

const getPostsRU = () => {
	const data = import.meta.globEager(`./posts/ru/*.md`);
	return data;
};

const getPostsEN = () => {
	const data = import.meta.globEager(`./posts/en/*.md`);
	return data;
};

export const getGuides = lang => {
	const postsData = lang === 'ru' ? getGuidesRU() : getGuidesEN();

	let posts = [];

	for (const path in postsData) {
		const postData = postsData[path];
		const { metadata } = postData;
		posts = [ ...posts, metadata ];
	}

	return posts;
};

export const getSingleGuide = (lang, slugTest) => {
	const postsData = lang === 'ru' ? getGuidesRU() : getGuidesEN();

	let posts = [];

	for (const path in postsData) {
		const postData = postsData[path];
		const { slug } = postData.metadata;
		const post = { postData, slug };
		posts = [ ...posts, post ];
	}

	return posts.find(p =>
		p.slug.toLowerCase() === slugTest.toLowerCase());
};

export const getPosts = lang => {
	const postsData = lang === 'ru' ? getPostsRU() : getPostsEN();

	let posts = [];

	for (const path in postsData) {
		const postData = postsData[path];
		const { metadata } = postData;
		posts = [ ...posts, metadata ];
	}

	return posts;
};

export const getSinglePost = (lang, slugTest) => {
	const postsData = lang === 'ru' ? getPostsRU() : getPostsEN();

	let posts = [];

	for (const path in postsData) {
		const postData = postsData[path];
		const { slug } = postData.metadata;
		const post = { postData, slug };
		posts = [ ...posts, post ];
	}

	return posts.find(p =>
		p.slug.toLowerCase() === slugTest.toLowerCase());
};

export const getArrays = lang => {
	const postsArray = getPosts(lang);
	const guidesArray = getGuides(lang);

	return {
		postsArray,
		guidesArray,
	};
};

export const getSingleInstance = (lang, slug) =>
	getSinglePost(lang, slug) || getSingleGuide(lang, slug);
