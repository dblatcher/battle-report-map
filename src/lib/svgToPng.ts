const getDomUrl = () => window.URL || window.webkitURL || window

function triggerDownload(imgURI: string, fileName: string) {
    const a = document.createElement('a');
    a.download = fileName
    a.target = '_blank';
    a.href = imgURI;

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

const svgElementToObjectUrl = async (svgNodeOriginal: SVGSVGElement): Promise<string> => {
    const svgNode = svgNodeOriginal.cloneNode(true) as SVGSVGElement
    await serialiseImages(svgNode)
    const svgString = (new XMLSerializer()).serializeToString(svgNode);

    const svgBlob = new Blob([svgString], {
        type: 'image/svg+xml;charset=utf-8'
    });

    return getDomUrl().createObjectURL(svgBlob);
}

export async function svgToSvgFile(svgNodeOriginal: SVGSVGElement, fileName: string = 'image.png') {
    const url = await svgElementToObjectUrl(svgNodeOriginal)
    triggerDownload(url, fileName);
    getDomUrl().revokeObjectURL(url);
}

export async function svgToPngFile(svgNodeOriginal: SVGSVGElement, fileName: string = 'image.png') {
    const url = await svgElementToObjectUrl(svgNodeOriginal)

    const image = new Image();
    image.width = svgNodeOriginal.width.baseVal.value;
    image.height = svgNodeOriginal.height.baseVal.value;
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
        getDomUrl().revokeObjectURL(url);

        const imgURI = canvas
            .toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
        triggerDownload(imgURI, fileName);
    };
};