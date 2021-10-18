export function global_search(columns = [], search) {
    let filters = columns.map((col) => {
        return { [col]: { $regex: `.*${search}.*`, $options: 'i' } }
    });
    return filters.length > 0 ? { $or: filters } : {}
}