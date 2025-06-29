"use client";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col"
      onClick={() => onAddToCart(product)}
    >
      <CardContent className="p-0 flex-grow">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover w-full aspect-square rounded-t-lg"
          data-ai-hint={product['data-ai-hint']}
        />
      </CardContent>
      <CardFooter className="p-3 flex-col items-start bg-card rounded-b-lg">
        <p className="font-semibold text-sm truncate w-full">{product.name}</p>
        <p className="text-primary font-bold text-sm">${product.price.toFixed(2)}</p>
      </CardFooter>
    </Card>
  );
}
