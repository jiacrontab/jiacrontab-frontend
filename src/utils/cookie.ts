export const getCookie = (name: string): string => {
    if (document.cookie.length > 0) {
        let start = document.cookie.indexOf(name + '=')
        if (start != -1) {
            start = start + name.length + 1
            let end = document.cookie.indexOf(';', start)
            if (end == -1) end = document.cookie.length
            return unescape(document.cookie.substring(start, end))
        }
    }
    return ''
}

export const setCooket = (name: string, value: string) => {
    document.cookie = name + '=' + escape(value)
}
