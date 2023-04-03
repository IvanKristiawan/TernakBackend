findNextKode = (dataLength, digitLength = 1) => {
  if (dataLength < 1) {
    return (1).toLocaleString("en-US", {
      minimumIntegerDigits: digitLength,
      useGrouping: false,
    });
  } else {
    let incrementLength = dataLength + 1;
    return incrementLength.toLocaleString("en-US", {
      minimumIntegerDigits: digitLength,
      useGrouping: false,
    });
  }
};

findNextKodeJenisCOA = (dataLength, digitLength = 1) => {
  if (dataLength < 0) {
    return (9).toLocaleString("en-US", {
      minimumIntegerDigits: digitLength,
      useGrouping: false,
    });
  } else {
    let incrementLength = dataLength + 1;
    return incrementLength.toLocaleString("en-US", {
      minimumIntegerDigits: digitLength,
      useGrouping: false,
    });
  }
};

findNextKodeSubGroupCOA = (dataLength, digitLength = 1) => {
  if (dataLength === 0) {
    return (0).toLocaleString("en-US", {
      minimumIntegerDigits: digitLength,
      useGrouping: false,
    });
  } else {
    let incrementLength = dataLength;
    return incrementLength.toLocaleString("en-US", {
      minimumIntegerDigits: digitLength,
      useGrouping: false,
    });
  }
};

// formatDate function will return dd-mm-yyyy for UI Indonesia
formatDate = (date) => {
  return `${date.getDate().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}-${(date.getMonth() + 1).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}-${date.getFullYear()}`;
};

module.exports = {
  findNextKode,
  findNextKodeJenisCOA,
  findNextKodeSubGroupCOA,
  formatDate,
};
