# File-size exceptions

The canonical lint baseline limits source files to 200 lines. These narrow exceptions remain single files because splitting them would obscure one cohesive API or visualization.

- `apps/web/src/shared/content/presentation/components/color-swatch-comparison.tsx` owns one interactive comparison, including its fixed data and private rendering helpers.
