const fetchTimeout = async (
    url: string,
    options: RequestInit = {},
    timeout = 10000
): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Запрос превысил лимит времени (${timeout / 1000} секунд)`);
        }
        throw error;
    }
};

export default fetchTimeout;