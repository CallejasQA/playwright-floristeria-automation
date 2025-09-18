import { test as base } from '@playwright/test';


export const test = base.extend({
baseURL: 'https://www.floristeriamundoflor.com/'
});


export { expect } from '@playwright/test';