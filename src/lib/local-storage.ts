type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type JsonObject = { [key: string]: Json };

function browserHasLocalStorage() {
    if (!window || typeof window.localStorage !== 'object') {
        return false
    }
    return true
}

function safeGetAndParse(storageKey: string): JsonObject {
    const contents = window.localStorage.getItem(storageKey)
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
    if (!browserHasLocalStorage) { return false }

    if (!window.localStorage.getItem(folderName)) {
        window.localStorage.setItem(folderName, JSON.stringify({}))
    }
    const folder: Json = safeGetAndParse(folderName)

    folder[itemName] = data
    window.localStorage.setItem(folderName, JSON.stringify(folder))

    return true
}

function removeItem(folderName: string, itemName: string): boolean {
    if (!browserHasLocalStorage) { return false }
    if (!window.localStorage.getItem(folderName)) { return false }
    const folder = safeGetAndParse(folderName)
    if (!folder[itemName]) { return false }

    delete folder[itemName];
    window.localStorage.setItem(folderName, JSON.stringify(folder))
    return true
}

function loadItem(folderName: string, itemName: string): JsonObject | undefined {
    if (!browserHasLocalStorage) { return undefined }
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