import { Injectable } from "@nestjs/common";

export interface ISearchStrategy {
    search(keyword: string): [];
}

export class SearchStrategy {
    private strategy: ISearchStrategy

    constructor(strategy: ISearchStrategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: ISearchStrategy) {
        this.strategy = strategy;
    }

    public search(keyword: string) {
        return this.strategy.search(keyword);
    }
}