export const snsImages = Array.from({ length: 88 }, (_, index) => {
  const imageNumber = index + 1;

  return {
    src: `/SNS/${imageNumber}.png`,
    alt: `SNS creative ${imageNumber}`,
    width: 1080,
    height: 1350,
  };
});

export const snsPreviewImages = [
  snsImages[49],
  snsImages[37],
  ...snsImages.slice(2, 5),
];

export const otherImages = Array.from({ length: 33 }, (_, index) => {
  const imageNumber = index + 1;
  const isWide = imageNumber >= 10 && imageNumber <= 16;

  return {
    src: `/others/${imageNumber}.png`,
    alt: `others creative ${imageNumber}`,
    width: 2500,
    height: isWide ? 843 : 1686,
  };
});

export const otherPreviewImages = otherImages.slice(0, 5);

export const otherSmallImages = Array.from({ length: 91 }, (_, index) => {
  const imageNumber = index + 1;

  return {
    src: `/others2/${imageNumber}.png`,
    alt: `small rich menu creative ${imageNumber}`,
    width: 2000,
    height: 647,
  };
});
