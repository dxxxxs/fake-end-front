import { useImperativeHandle, useState } from "react";
import { faker } from "@faker-js/faker";
import { capitalizeFirstLetter } from "@/app/utils";
import { BodyItem, EndpointBody } from "@/types";

interface EndpointBodyMockProp {
    name: string;
    onBodyItemsChange: (name: string, bodyItems: BodyItem[]) => void;
    ref: React.Ref<{ resetBodyItems: () => void, handleSetBodyItems: (responseBody: EndpointBody) => void }>;
}

const EndpointBodyMock = ({ name, onBodyItemsChange, ref }: EndpointBodyMockProp) => {
    const bodyTypes = ['string', 'number', 'date', 'boolean', 'object', 'array', 'faker'];

    const fakerRawDefinitions = faker.rawDefinitions;
    const firstMethods = Object.keys(fakerRawDefinitions);

    const [bodyItems, setBodyItems] = useState<BodyItem[]>([]);

    const updateBodyItems = (newBodyItems: BodyItem[]) => {
        setBodyItems(newBodyItems);
        onBodyItemsChange(name, newBodyItems);
    };

    const resetBodyItems = () => {
        setBodyItems([]);
        onBodyItemsChange(name, []);
    };

    const transformResponseBodyToBodyItems = (responseBody: EndpointBody): BodyItem[] => {
        if (!responseBody || typeof responseBody !== "object") {
            console.error("Invalid responseBody:", responseBody);
            return [];
        }

        return Object.entries(responseBody).map(([key, value]) => ({
            id: self.crypto.randomUUID(),
            name: key,
            type: value,
        }));
    };

    const handleSetBodyItems = (responseBody: EndpointBody) => {
        if (responseBody && typeof responseBody == "object") {
            const transformedBodyItems = transformResponseBodyToBodyItems(responseBody);
            updateBodyItems(transformedBodyItems);
        }
    };

    useImperativeHandle(ref, () => ({
        resetBodyItems,
        handleSetBodyItems
    }));


    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const { name, value } = e.target;
        updateBodyItems(
            bodyItems.map((item, i) => {
                if (i === index) {
                    const updatedItem = { ...item, [name]: value };
                    if (name === "type" && value === "faker") {
                        const primaryMethod = firstMethods[0];
                        const secondaryMethod = Object.keys(fakerRawDefinitions[primaryMethod] || {})[0] || "";
                        updatedItem.type = `faker.${primaryMethod}.${secondaryMethod}`;
                    }
                    return updatedItem;
                }
                return item;
            })
        );
    };

    const handleFakerMethodChange = (primaryMethod: string, secondaryMethod: string, index: number) => {
        updateBodyItems(
            bodyItems.map((item, i) =>
                i === index
                    ? { ...item, type: `faker.${primaryMethod}.${secondaryMethod}` }
                    : item
            )
        );
    };

    const addNewItem = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const uuid = self.crypto.randomUUID();
        updateBodyItems([
            ...bodyItems,
            { name: "", type: bodyTypes[0], id: uuid }
        ]);
    };

    const deleteItem = (id: string) => {
        updateBodyItems(bodyItems.filter((item) => item.id !== id));
    };

    const resetSecondaryMethod = (primaryMethod: string, index: number) => {
        const firstSecondaryMethod =
            Object.keys(fakerRawDefinitions[primaryMethod] || [])[0] || "";
        updateBodyItems(
            bodyItems.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        type: `faker.${primaryMethod}.${firstSecondaryMethod}`,
                    }
                    : item
            )
        );
    };

    return (
        <div className="py-2">
            <label htmlFor="responseBody" className="label">{name}</label>
            <button
                className="btn btn-neutral"
                onClick={addNewItem}
            >
                +
            </button>

            {bodyItems.map((item, index) => {
                const primaryMethod = item.type.startsWith("faker")
                    ? item.type.split(".")[1]
                    : firstMethods[0];
                const secondaryMethods = Object.keys(fakerRawDefinitions[primaryMethod] || {});

                return (
                    <div className="flex items-center space-x-2" key={item.id}>
                        <input
                            type="text"
                            className="input input-bordered w-full max-w-xs"
                            value={item.name}
                            onChange={(e) =>
                                updateBodyItems(
                                    bodyItems.map((itm, i) =>
                                        i === index ? { ...itm, name: e.target.value } : itm
                                    )
                                )
                            }
                        />
                        <select
                            className="select w-full max-w-xs"
                            onChange={(e) => handleInputChange(e, index)}
                            name="type"
                            value={item.type.startsWith("faker") ? "faker" : item.type}
                        >
                            {bodyTypes.map((type, i) => (
                                <option key={i} value={type}>{capitalizeFirstLetter(type)}</option>
                            ))}
                        </select>
                        {item.type.startsWith("faker") && (
                            <>
                                <select
                                    className="select w-full max-w-xs"
                                    value={primaryMethod}
                                    onChange={(e) => {
                                        const newPrimaryMethod = e.target.value;
                                        resetSecondaryMethod(newPrimaryMethod, index);
                                    }}
                                >
                                    {firstMethods.map((method, i) => (
                                        <option key={i} value={method}>
                                            {capitalizeFirstLetter(method).replaceAll('_', ' ')}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="select w-full max-w-xs"
                                    value={item.type.split(".")[2] || ""}
                                    onChange={(e) => {
                                        handleFakerMethodChange(primaryMethod, e.target.value, index);
                                    }}
                                >
                                    {secondaryMethods.map((method, i) => (
                                        <option key={i} value={method + "()"}>
                                            {capitalizeFirstLetter(method).replaceAll('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </>
                        )}
                        <button
                            className="btn btn-neutral"
                            onClick={() => deleteItem(item.id)}
                        >
                            -
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default EndpointBodyMock;
