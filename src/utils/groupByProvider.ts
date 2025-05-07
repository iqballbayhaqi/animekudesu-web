type PlayerOption = {
  id: string;
  title: string;
  post: string;
  action: string;
  nume: string;
  type: string;
  video: string;
};

type GroupedPlayerOptions = Record<string, PlayerOption[]>;

function groupByProvider(options: PlayerOption[]): GroupedPlayerOptions {
  const result: GroupedPlayerOptions = {};

  options.forEach((option) => {
    const provider = option.title.split(" ")[0];

    if (!result[provider]) {
      result[provider] = [];
    }

    result[provider].push(option);
  });

  return result;
}

export default groupByProvider;
