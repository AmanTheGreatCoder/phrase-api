import { Prisma } from '@prisma/client';
import { PaginateQueryDto } from './dto/paginate-query.dto';

export interface Pagination {
  orderBy?: Prisma.PhraseOrderByWithRelationInput[];
  where?: Prisma.JsonObject;
}

export const paginate = (query: PaginateQueryDto) => {
  const paginationParams: Pagination = {
    orderBy: [],
    where: {},
  };

  console.log(query);

  const searchFields = query.searchFields ? query.searchFields.split(',') : [];
  const search = query.query ? query.query : '';

  if (search && searchFields.length) {
    paginationParams.where = {
      OR: searchFields.map((field) => {
        if (field.includes('.')) {
          const parts = field.split('.');
          let nestedQuery: any = { contains: search, mode: 'insensitive' };
          for (let i = parts.length - 1; i >= 0; i--) {
            nestedQuery = { [parts[i]]: nestedQuery };
          }
          return nestedQuery;
        } else {
          return { [field]: { contains: search, mode: 'insensitive' } };
        }
      }),
    };
  }

  if (query.sort) {
    const sortCriteria = query.sort.split(',');
    sortCriteria.forEach((s) => {
      const [key, value] = s.split(':') as [string, 'asc' | 'desc'];
      const keys = key.split('.');
      const orderByObj: any = {};
      let currentObj = orderByObj;

      for (let i = 0; i < keys.length - 1; i++) {
        currentObj[keys[i]] = {};
        currentObj = currentObj[keys[i]];
      }
      currentObj[keys[keys.length - 1]] = value;

      paginationParams.orderBy!.push(orderByObj);
    });
  } else {
    paginationParams.orderBy = [{ createdAt: 'desc' }];
  }

  return paginationParams;
};
