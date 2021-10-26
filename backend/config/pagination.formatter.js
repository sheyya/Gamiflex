export function getPagination(page = 0, size = 35) {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset };
}

export function getPagingData(data = [], page, limit, total) {
    const current = page ? +page : 0;
    const pages = Math.ceil(total / limit);
    return { data, meta: { pages, current, total } };
}