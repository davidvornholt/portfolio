# File-size exceptions

The canonical lint baseline limits source files to 200 lines. These narrow exceptions remain single files because splitting them would obscure one cohesive API or visualization.

- `apps/web/src/shared/content/presentation/components/color-swatch-comparison.tsx` owns one interactive comparison, including its fixed data and private rendering helpers.
- `apps/web/src/shared/ui/presentation/components/combobox.tsx` is one generated-style shadcn component API whose subcomponents share private context.
- `apps/web/src/shared/ui/presentation/components/dropdown-menu.tsx` is one generated-style shadcn component API over the same Base UI primitive.
- `apps/web/src/shared/ui/presentation/components/field.tsx` is one generated-style shadcn field composition API.
