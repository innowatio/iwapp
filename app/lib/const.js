export const headerHeight = 40;
export const statusBarHeight = 22;

export function heightWithoutHeader (height) {
    return height - headerHeight - statusBarHeight - 15;
}
