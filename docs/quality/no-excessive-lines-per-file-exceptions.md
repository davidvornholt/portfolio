# File-size exceptions

The canonical lint baseline limits source files to 200 lines. These narrow exceptions remain single files because splitting them would obscure one cohesive API or visualization.

- `apps/web/src/shared/content/presentation/components/color-swatch-comparison.tsx` owns one interactive comparison, including its fixed data and private rendering helpers.
- `apps/web/src/features/works/content/*.tsx` and `apps/web/src/features/posts/content/*.tsx` are single-document content entries: each file is one case study or post authored as TSX. Splitting a document across files would obscure the document.
