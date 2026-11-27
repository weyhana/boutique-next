import type { Field } from "@/components/EntityForm";

export const clientFields: Field[] = [
  { name: "Nom", label: "Nom", required: true, placeholder: "Ndiaye" },
  { name: "Prenom", label: "Prénom", required: true, placeholder: "Moussa" },
  { name: "Telephone", label: "Téléphone", type: "tel", placeholder: "770000000" },
  { name: "Email", label: "Email", type: "email", required: true, placeholder: "moussa@gmail.com" },
  { name: "Ville", label: "Ville", placeholder: "Dakar" },
];

export const produitFields: Field[] = [
  { name: "Nom", label: "Nom du produit", required: true, placeholder: "Clavier" },
  { name: "Prix", label: "Prix (FCFA)", type: "number", required: true, min: 0, step: "0.01" },
  { name: "Stock", label: "Stock", type: "number", required: true, min: 0, step: "1" },
];