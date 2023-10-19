import { ReactNode, createContext, useContext } from "react";

export type ImageDefMap = Record<string, string>

const imageDefContext = createContext<ImageDefMap>({})

const ImageDefProvider = imageDefContext.Provider

export const ImageDefsAndProvider = (props: { hrefs: string[], idPrefix: string, children: ReactNode }) => {

    const { hrefs, idPrefix, children } = props

    const map: ImageDefMap = hrefs.reduce(((mapSoFar, nextHref) => {
        if (nextHref in mapSoFar) {
            return mapSoFar
        }
        return { ...mapSoFar, [nextHref]: `${idPrefix}${nextHref}` }
    }), {})

    return <ImageDefProvider value={map}>

        <defs>
            {Object.entries(map).map(([href, id]) => (
                <image href={href} key={id} id={id}
                    width={100}
                    height={100}
                    preserveAspectRatio="none"
                />
            ))}
        </defs>

        {children}
    </ImageDefProvider>

}

/**get the id for the image in the def section SVG document */
export const useImageDefId = (href: string): string | undefined => {
   return useContext(imageDefContext)[href]
}

/**get a use node for the image in the def section SVG document (or undefined if there is no matching def) */
export const useImageDefUseNode = (href: string): ReactNode => {
    const imageDefId = useContext(imageDefContext)[href]
    if (!imageDefId) { return undefined }
    return <use href={'#' + imageDefId} />
}

