import React, { useState, useCallback } from "react";
import _debounce from "lodash/debounce";
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
} from "@heroui/react";
import Image from "@/components/common/Image.tsx";

// 🧩 Tipo del prop 'members'
interface Member {
  name: string;
  // podés agregar más propiedades si existen, por ejemplo:
  // url?: string;
}

interface AppProps {
  members: Member[];
}

export default function App({ members }: AppProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [mems, setMems] = useState<Member[]>(members);
  const [angle, setAngle] = useState<number>(0);
  const [current, setCurrent] = useState<number>(0);

  // 🔁 Mezcla los miembros y rota el ícono
  const refresh = useCallback(
    _debounce(() => {
      setMems((prev) => [...prev].sort(() => Math.random() - 0.5));
      setAngle((prev) => prev + 720);
    }, 1000, { leading: true, trailing: false }),
    []
  );

  // ⏳ Cambio de imagen con debounce
  const debouncedSetCurrent = useCallback(
    _debounce((value: number) => {
      setCurrent(value);
    }, 300, {
      leading: true,
      trailing: false,
    }),
    []
  );

  return (
    <div className="relative gap-1 pt-4 columns-2 sm:columns-4 xl:columns-6">
      {!isOpen && (
        <Button
          onPress={() => refresh()}
          className="bg-white border border-black rounded-full fixed z-10 top-[95dvh] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 hover:scale-150 p-0"
          isIconOnly
          aria-label="refresh"
          variant="faded"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <span className="icon-[material-symbols-light--refresh-rounded] size-full" />
        </Button>
      )}

      {mems.map((mem: Member, idx: number) => (
        <div key={mem.name} className="relative group overflow-hidden mb-1 shadow-xl">
          <Image
            imageInfo={mem}
            src={mem.name}
            classNames={{
              img: "transition duration-300 ease-in-out active:scale-108 hover:scale-108 object-cover filter grayscale-95 transition duration-500 group-hover:grayscale-0",
            }}
            onTouchStart={(e: React.TouchEvent<HTMLImageElement>) =>
              e.currentTarget.classList.remove("grayscale-95")
            }
            onTouchEnd={(e: React.TouchEvent<HTMLImageElement>) =>
              e.currentTarget.classList.add("grayscale-95")
            }
            onClick={() => {
              setCurrent(idx);
              onOpen();
            }}
          />
        </div>
      ))}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        scrollBehavior="inside"
        backdrop="opaque"
        classNames={{
          base: "w-full h-full object-cover object-center max-w-full max-h-full !m-0",
          closeButton:
            "size-10 min-w-[unset] opacity-80 fixed z-99 top-[95dvh] left-1/2 -translate-x-1/2 -translate-y-1/2",
          backdrop: "bg-[#292f46]/60 backdrop-opacity-40",
        }}
        closeButton={
          <Button isIconOnly aria-label="close" variant="faded">
            <span
              className="icon-[carbon--close-filled] bg-white size-full scale-150"
              style={{ transform: `rotate(${angle}deg)` }}
            />
          </Button>
        }
      >
        <ModalContent>
          {(onClose) => (
            <>
              <Button
                onPress={() =>
                  debouncedSetCurrent(current - 1 < 0 ? mems.length - 1 : current - 1)
                }
                className="size-8 min-w-[unset] fixed z-99 top-1/2 left-[1dvw] -translate-y-1/2 opacity-80"
                isIconOnly
                aria-label="left"
                variant="faded"
              >
                <span className="icon-[pepicons-pop--angle-left-circle-filled] bg-white size-full" />
              </Button>

              <picture className="w-full h-full">
                <source srcSet={`${mems[current].name}.avif`} type="image/avif" />
                <source srcSet={`${mems[current].name}.webp`} type="image/webp" />
                <img
                alt={`Imagen ampliada de ${mems[current].name}`}
                  className="max-w-full max-h-full w-[90dvw] h-[90dvh] object-contain m-auto mt-[5dvh]"
                  src={`${mems[current].name}.webp`}
                  onContextMenu={(e) => e.preventDefault()}
                  onTouchStart={(e) => e.preventDefault()}
                  onTouchEnd={(e) => e.preventDefault()}
                />
              </picture>

              <Button
                onPress={() =>
                  debouncedSetCurrent(current + 1 >= mems.length ? 0 : current + 1)
                }
                className="size-8 min-w-[unset] fixed z-99 top-1/2 right-[1dvw] -translate-y-1/2 opacity-80"
                isIconOnly
                aria-label="right"
                variant="faded"
              >
                <span className="icon-[pepicons-pop--angle-right-circle-filled] bg-white size-full" />
              </Button>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
