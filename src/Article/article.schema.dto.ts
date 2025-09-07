export class ArticleDTO {
  articleSlug: string;
  articleTitle: string;
  articleDescription: string;
  articleCategory: string | CategoryDTO;
  articleTags: (string | TagDTO)[];
  articleImg: string;
  articleImgAlt: string;
  articleH1: string;
  article: string;
}

export class CategoryDTO {
  categorySlug: string;
  categoryName: string;
  categoryImage: string;
  categoryImageAlt: string;
  categoryTitle: string;
  categoryDescription: string;
}

export class TagDTO {
  tagSlug: string;
  tagName: string;
  tagImage: string;
  tagImageAlt: string;
  tagTitle: string;
  tagDescription: string;
}
