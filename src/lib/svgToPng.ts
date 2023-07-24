function triggerDownload(imgURI: string, fileName: string) {
    const a = document.createElement('a');
    a.download = fileName
    a.target = '_blank';
    a.href = imgURI;

    // trigger download button
    // (set `bubbles` to false here.
    // or just `a.click()` if you don't care about bubbling)
    a.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true
    }));
}


async function srcToBase64DataUrl(src: string): Promise<string | undefined> {
    try {
        const response = await fetch(src)
        const blob = await response.blob()
        const outcome = await new Promise((resolve, reject) => {
            const reader = Object.assign(new FileReader(), {
                onload: () => resolve(reader.result),
                onerror: () => reject(reader.error),
            });
            reader.readAsDataURL(blob);
        });
        return typeof outcome === 'string' ? outcome : undefined
    } catch {
        return undefined
    }
}


const serialiseImages = async (svgNode: SVGSVGElement): Promise<SVGSVGElement> => {
    const images = Array.from(svgNode.querySelectorAll('image'))
    const urlsAlreadyResolved: Partial<Record<string, string>> = {}

    await Promise.all(images.map(async image => {
        const href = image.getAttribute('href')
        if (!href) { return }
        const existingUrl = urlsAlreadyResolved[href]
        if (existingUrl) {
            image.setAttribute('href', existingUrl)
            return
        }
        const dataUrl = await srcToBase64DataUrl(href)
        urlsAlreadyResolved[href] = dataUrl
        if (!dataUrl) {
            return
        }
        image.setAttribute('href', dataUrl)
    }))

    return svgNode
}

export async function svgToPng(svgNode: SVGSVGElement, fileName: string = 'image.png') {

    await serialiseImages(svgNode)
    const svgString = (new XMLSerializer()).serializeToString(svgNode);

    const svgBlob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8'
    });

    const DOMURL = window.URL || window.webkitURL || window;
    const url = DOMURL.createObjectURL(svgBlob);

    const image = new Image();
    image.width = svgNode.width.baseVal.value;
    image.height = svgNode.height.baseVal.value;
    image.src = url;

    image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return
        }
        ctx.drawImage(image, 0, 0);
        DOMURL.revokeObjectURL(url);

        const imgURI = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        triggerDownload(imgURI, fileName);
    };
};