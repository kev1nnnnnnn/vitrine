
import Genre from '#models/genre'

interface ListGenresFilters {
  page?: number
  limit?: number
  search?: string
}

export default class GenreService {
  async list(filters: ListGenresFilters = {}) {
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20

    const query = Genre.query()
      .where('is_active', true)
      .orderBy('name', 'asc')

    if (filters.search) {
      query.where((builder) => {
        builder
          .where('name', 'like', `%${filters.search}%`)
          .orWhere('slug', 'like', `%${filters.search}%`)
      })
    }

    return query.paginate(page, limit)
  }

  async findById(id: number | string) {
    return Genre.query()
      .where('id', id)
      .where('is_active', true)
      .first()
  }
}
