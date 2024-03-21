import { AttributeDto } from "./dto/attributes.tdo";
import { ProductDto } from "./dto/product.dto";

export class ProductBuilder {
    private product: ProductDto;
  
    constructor() {
      this.product = new ProductDto();
    }
  
    setName(name: string): ProductBuilder {
      this.product.name = name;
      return this;
    }
  
    setQuantitySold(quantity_sold: number): ProductBuilder {
      this.product.quantity_sold = quantity_sold;
      return this;
    }
  
    setDescription(description: string): ProductBuilder {
      this.product.description = description;
      return this;
    }
  
    setAttributes(attributes: AttributeDto[]): ProductBuilder {
      this.product.attributes = attributes;
      return this;
    }
  
    setHighlights(highlights: []): ProductBuilder {
      this.product.highlights = highlights;
      return this;
    }
  
    setMainImage(main_image: Buffer): ProductBuilder {
      this.product.main_image = main_image;
      return this;
    }
  
    setBrand(brand: string): ProductBuilder {
      this.product.brand = brand;
      return this;
    }
  
    build(): ProductDto {
      return this.product;
    }
  }