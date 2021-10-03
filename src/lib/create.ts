
export function createObject(id: string): Record<string, any> {
   return {
      id,
      createdAt: new Date()
   }
}
