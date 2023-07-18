import { SimpleGrid } from "@chakra-ui/react";
import { TattooStatus } from "greenbox-data";
import { useMemo } from "react";

import { useAppSelector } from "../hooks";
import { createPlayerDataSelector } from "../store";

import Section from "./Section";
import Tattoo from "./Tattoo";

const selectPlayerOutfitTattoos = createPlayerDataSelector("outfitTattoos");

export default function Tattoos() {
  const playerOutfitTattoos = useAppSelector(selectPlayerOutfitTattoos);
  const tattoos = useAppSelector((state) => state.tattoos);
  const outfitTattoos = useMemo(() => tattoos.filter((t) => t.outfit !== undefined), [tattoos]);
  const loading = useAppSelector((state) => state.loading.tattoos || false);

  const totalOutfitTattos = useMemo(
    () => playerOutfitTattoos.filter((s) => s[1] === TattooStatus.HAVE).length,
    [playerOutfitTattoos],
  );
  const totalOutfits = useMemo(
    () => playerOutfitTattoos.filter((s) => s[1] === TattooStatus.HAVE_OUTFIT).length,
    [playerOutfitTattoos],
  );
  const idToOutfitTattoo = useMemo(
    () =>
      playerOutfitTattoos.reduce(
        (acc, t) => ({ ...acc, [t[0]]: t }),
        {} as { [id: number]: (typeof playerOutfitTattoos)[number] },
      ),
    [playerOutfitTattoos],
  );

  return (
    <Section
      title="Tattoos"
      icon="itemimages/palette.gif"
      loading={loading}
      values={[
        {
          color: "partial",
          value: totalOutfits,
          name: `${totalOutfits} / ${outfitTattoos.length} tattoos unlocked`,
        },
        {
          color: "complete",
          value: totalOutfitTattos,
          name: `${totalOutfitTattos} / ${outfitTattoos.length} tattoos unlocked`,
        },
      ]}
      max={outfitTattoos.length}
    >
      <SimpleGrid columns={[4, null, 6]} spacing={1}>
        {outfitTattoos.map((t) => (
          <Tattoo
            key={Array.isArray(t.image) ? t.image[0] : t.image}
            tattoo={t}
            status={idToOutfitTattoo[t.outfit!]?.[1] ?? 0}
          />
        ))}
      </SimpleGrid>
    </Section>
  );
}
