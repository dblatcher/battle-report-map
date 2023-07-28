const debugMode = false

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
type JsonObject = { [key: string]: Json };

function browserHasLocalStorage() {
    if (typeof localStorage !== 'object') {
        return false
    }
    return true
}

function safeGetAndParse(storageKey: string): JsonObject {
    const contents = localStorage.getItem(storageKey)
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

    if (!localStorage.getItem(folderName)) {
        localStorage.setItem(folderName, JSON.stringify({}))
    }
    const folder: Json = safeGetAndParse(folderName)

    folder[itemName] = data
    localStorage.setItem(folderName, JSON.stringify(folder))

    if (debugMode) {
        console.log(`*storage* save for ${folderName}/${itemName}`, data)
    }
    return true
}

function removeItem(folderName: string, itemName: string): boolean {
    if (!browserHasLocalStorage) { return false }
    if (!localStorage.getItem(folderName)) { return false }
    const folder = safeGetAndParse(folderName)
    if (!folder[itemName]) { return false }

    delete folder[itemName];
    localStorage.setItem(folderName, JSON.stringify(folder))
    return true
}

function loadItem(folderName: string, itemName: string): JsonObject | undefined {
    if (!browserHasLocalStorage) { return undefined }
    const folder = safeGetAndParse(folderName)
    const item = folder[itemName]
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return undefined
    }

    if (debugMode) {
        console.log(`*storage* load for ${folderName}/${itemName} - returning`, folder[itemName])
    }

    return item
}

function getItemNames(folderName: string): string[] {
    if (!browserHasLocalStorage) { return [] }
    if (!localStorage.getItem(folderName)) {
        if (debugMode) {
            console.log(`*storage* getItemName for ${folderName}, no folder, returning`, [])
        }
        return []
    }
    const folder = safeGetAndParse(folderName)
    if (debugMode) {
        console.log(`*storage* getItemName for ${folderName}, ${folder.length} items`, { folderName, folder })
    }
    return Object.keys(folder)
}

export { saveItem, loadItem, getItemNames, removeItem, browserHasLocalStorage }