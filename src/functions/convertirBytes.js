export const convertirBytes = (bytes) => {
    const megabytes = bytes / (1024 * 1024);
    const gigabytes = bytes / (1024 * 1024 * 1024);

    if (gigabytes >= 1) {
        return gigabytes.toFixed(1) + 'GB';
    } else {
        return megabytes.toFixed(1) + 'MB';
    }
}