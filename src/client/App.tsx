import { css } from "../styled-system/css";
import { useEffect, useState } from "react";
import type { CreateWishItemInput, WishItem } from "../shared/types";

const initialForm: CreateWishItemInput = {
  title: "",
  url: "",
  notes: ""
};

export const App = () => {
  const [items, setItems] = useState<WishItem[]>([]);
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);

  const loadItems = async () => {
    const response = await fetch("/api/items");
    const data = (await response.json()) as { items: WishItem[] };
    setItems(data.items);
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Unable to save item.");
      }

      setForm(initialForm);
      await loadItems();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main
      className={css({
        minH: "100vh",
        bg: "page",
        backgroundImage:
          "radial-gradient(circle at top, rgba(249, 197, 107, 0.28), transparent 35%), linear-gradient(180deg, #fffdfa 0%, #f8f2e7 100%)",
        px: { base: "4", md: "8" },
        py: { base: "8", md: "12" }
      })}
    >
      <div
        className={css({
          mx: "auto",
          maxW: "6xl",
          display: "grid",
          gap: "8",
          gridTemplateColumns: { base: "1fr", lg: "360px 1fr" },
          alignItems: "start"
        })}
      >
        <section
          className={css({
            position: { lg: "sticky" },
            top: { lg: "8" },
            borderRadius: "3xl",
            bg: "panel",
            boxShadow: "0 20px 60px rgba(69, 49, 19, 0.12)",
            border: "1px solid rgba(185, 95, 0, 0.08)",
            p: "6"
          })}
        >
          <p
            className={css({
              m: 0,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: "xs",
              color: "accent",
              fontWeight: "700"
            })}
          >
            To Buy
          </p>
          <h1
            className={css({
              mt: "3",
              mb: "2",
              fontSize: { base: "3xl", md: "4xl" },
              lineHeight: "1.05"
            })}
          >
            Save links before they disappear into twenty open tabs.
          </h1>
          <p
            className={css({
              mt: 0,
              mb: "6",
              color: "muted",
              lineHeight: "1.6"
            })}
          >
            Drop in products, gift ideas, or impulse finds and keep them in one place.
          </p>

          <form
            onSubmit={submit}
            className={css({
              display: "grid",
              gap: "4"
            })}
          >
            {[
              ["title", "Item name", "Vintage desk lamp"],
              ["url", "Link", "https://example.com/product"],
              ["notes", "Notes", "Why you want it, preferred color, target price..."]
            ].map(([key, label, placeholder]) => (
              <label
                key={key}
                className={css({
                  display: "grid",
                  gap: "2",
                  fontSize: "sm",
                  fontWeight: "600"
                })}
              >
                {label}
                {key === "notes" ? (
                  <textarea
                    value={form[key as keyof CreateWishItemInput] ?? ""}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, notes: event.target.value }))
                    }
                    placeholder={placeholder}
                    rows={4}
                    className={inputStyles}
                  />
                ) : (
                  <input
                    type={key === "url" ? "url" : "text"}
                    value={form[key as "title" | "url"]}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [key]: event.target.value
                      }))
                    }
                    placeholder={placeholder}
                    className={inputStyles}
                    required
                  />
                )}
              </label>
            ))}

            <button
              type="submit"
              disabled={isSaving}
              className={css({
                appearance: "none",
                border: "none",
                borderRadius: "full",
                bg: "accent",
                color: "white",
                py: "3",
                px: "5",
                fontWeight: "700",
                cursor: "pointer",
                transition: "transform 150ms ease, opacity 150ms ease",
                _hover: {
                  transform: "translateY(-1px)",
                  opacity: 0.94
                },
                _disabled: {
                  cursor: "wait",
                  opacity: 0.7
                }
              })}
            >
              {isSaving ? "Saving..." : "Add to list"}
            </button>
          </form>
        </section>

        <section
          className={css({
            display: "grid",
            gap: "4"
          })}
        >
          {items.length === 0 ? (
            <div
              className={css({
                borderRadius: "3xl",
                bg: "rgba(255, 252, 247, 0.8)",
                border: "1px dashed rgba(185, 95, 0, 0.28)",
                p: "8",
                color: "muted",
                textAlign: "center"
              })}
            >
              Your list is empty. Add your first thing to buy.
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className={css({
                  borderRadius: "3xl",
                  bg: "panel",
                  p: "5",
                  border: "1px solid rgba(185, 95, 0, 0.1)",
                  boxShadow: "0 10px 35px rgba(69, 49, 19, 0.08)"
                })}
              >
                <div
                  className={css({
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "4",
                    alignItems: "start"
                  })}
                >
                  <div>
                    <h2
                      className={css({
                        mt: 0,
                        mb: "2",
                        fontSize: "xl"
                      })}
                    >
                      {item.title}
                    </h2>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className={css({
                        color: "accent",
                        fontWeight: "600",
                        textDecoration: "none",
                        wordBreak: "break-all"
                      })}
                    >
                      {item.url}
                    </a>
                  </div>
                  <span
                    className={css({
                      whiteSpace: "nowrap",
                      fontSize: "xs",
                      color: "muted"
                    })}
                  >
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {item.notes ? (
                  <p
                    className={css({
                      mt: "4",
                      mb: 0,
                      color: "muted",
                      lineHeight: "1.6"
                    })}
                  >
                    {item.notes}
                  </p>
                ) : null}
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

const inputStyles = css({
  width: "100%",
  borderRadius: "xl",
  border: "1px solid rgba(78, 67, 54, 0.16)",
  bg: "white",
  px: "4",
  py: "3",
  font: "inherit",
  color: "ink",
  outline: "none",
  transition: "border-color 150ms ease, box-shadow 150ms ease",
  _focus: {
    borderColor: "accent",
    boxShadow: "0 0 0 4px rgba(249, 197, 107, 0.32)"
  },
  _placeholder: {
    color: "rgba(78, 67, 54, 0.58)"
  }
});
