export function preload(imageURLs, done) {
    const images = [];
    let count = 0;
    imageURLs = (typeof imageURLs != 'object') ? [imageURLs] : imageURLs;

    imageURLs.length === 0 && done(images);

    imageURLs.map(imageURL => {
        const image = new Image();
        image.src = imageURL;
        image.crossOrigin = '*';
        image.addEventListener('load', imageOnLoad);
        image.addEventListener('error', imageOnLoad);
        images.push(image);
    });

    function imageOnLoad() {
        count ++;
        if (count == imageURLs.length) done(images);
    }
}
