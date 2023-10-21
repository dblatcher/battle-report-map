type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type JsonObject = { [key: string]: Json };

const windowInstance: Window | undefined = globalThis.window

function browserHasLocalStorage() {
    if (!windowInstance || typeof windowInstance.localStorage !== 'object') {
        return false
    }
    return true
}

function safeGetAndParse(storageKey: string): JsonObject {
    const contents = windowInstance?.localStorage.getItem(storageKey)
    if (!contents) { return {} }
    try {
        const parsed: Json = JSON.parse(contents)
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return {}
        }
        return parsed
    } catch (e) {
        return {}
    }
}

function saveItem(folderName: string, itemName: string, data: JsonObject): boolean {
    if (!windowInstance || !browserHasLocalStorage) { return false }

    if (!windowInstance.localStorage.getItem(folderName)) {
        windowInstance.localStorage.setItem(folderName, JSON.stringify({}))
    }
    const folder: Json = safeGetAndParse(folderName)

    folder[itemName] = data
    windowInstance.localStorage.setItem(folderName, JSON.stringify(folder))

    return true
}

function removeItem(folderName: string, itemName: string): boolean {
    if (!windowInstance || !browserHasLocalStorage) { return false }
    if (!windowInstance.localStorage.getItem(folderName)) { return false }
    const folder = safeGetAndParse(folderName)
    if (!folder[itemName]) { return false }

    delete folder[itemName];
    windowInstance.localStorage.setItem(folderName, JSON.stringify(folder))
    return true
}

function loadItem(folderName: string, itemName: string): JsonObject | undefined {
    if (!windowInstance || !browserHasLocalStorage) { return undefined }
    const folder = safeGetAndParse(folderName)
    const item = folder[itemName]
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return undefined
    }
    return item
}

function getItemNames(folderName: string): string[] {
    if (!browserHasLocalStorage) { return [] }
    const folder = safeGetAndParse(folderName)
    return Object.keys(folder)
}

export { saveItem, loadItem, getItemNames, removeItem, browserHasLocalStorage }