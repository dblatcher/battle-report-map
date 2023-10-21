import { ImageAsset } from "@/types"
import { getItemNames, loadItem, removeItem, saveItem } from "./local-storage"

const FOLDER_NAME = "IMAGE_ASSETS"

export const getStoredImageAssets = (): ImageAsset[] => {
    const names = getItemNames(FOLDER_NAME)
    const assets = names.map(name => loadItem(FOLDER_NAME, name))
    return assets.reduce<ImageAsset[]>((list, nextItem) => {
        if (!nextItem) { return list }
        return [...list, nextItem as ImageAsset]
    }, [])
}

export const saveStoredImageAsset = (asset: ImageAsset) => {
    return saveItem(FOLDER_NAME, asset.description, asset)
}

export const removeStoredImageAsset = (description:string) => {
    return removeItem(FOLDER_NAME, description)
}