export * from './components/think-list/think-list.component';
export * from './components/think-dialog/think-dialog.component';
export * from './services/think.service';
export * from './models/think.model';
export * from './models/think-request.model';
export * from './thinks.routes';

// Type aliases for easier imports (matching other modules)
export type { ThinkResponse, ThinkResponse as Think } from './models/think.model';
export type { ThinkRequest } from './models/think-request.model';
