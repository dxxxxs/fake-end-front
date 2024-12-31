"use client";
import { BodyItem, Endpoint, EndpointBody } from '@/types';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import EndpointBodyMock from './EndpointBodyMock';
import { createEndpoint } from '../services/create-endpoint';
import { updateEndpoint } from '../services/update-endpoint';

interface EndpointCreationProp {
    onSubmitForm: (newEndpoint: Endpoint | null) => void;
    ref: React.Ref<{ setEndpoint: (endpoint: Endpoint) => void, openModal: () => void }>;
}

export default function EndpointCreationForm({ onSubmitForm, ref }: EndpointCreationProp) {

    const [formData, setFormData] = useState<Endpoint>({
        name: '',
        path: '',
        method: 'GET',
        statusCode: 200,
        body: {},
        headers: {},
        queryParams: {},
        description: '',
        isActive: true,
        responseDelay: 0,
        responseBody: {},
        responseHeaders: {},
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: ["statusCode", "responseDelay"].includes(name) ? Number(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = formData._id ? await updateEndpoint(formData) : await createEndpoint(formData);

        console.log(formData);
        onSubmitForm(result);
        closeModal();
    };

    const openModal = () => {
        const dialog = document.getElementById('modal_3') as HTMLDialogElement;
        dialog?.showModal();
    };

    const closeModal = () => {
        const dialog = document.getElementById('modal_3') as HTMLDialogElement;
        dialog?.close();
    };

    const handleBodyItemsChange = (name: string, updatedBodyItems: BodyItem[]) => {
        const bodyObject = updatedBodyItems.reduce((acc, item) => {
            if (item.name) {
                acc[item.name] = item.type;
            }
            return acc;
        }, {} as Record<string, string>);

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: bodyObject,
        }));
    };

    const setEndpoint = (endpoint: Endpoint) => {
        setFormData(endpoint);
        bodyMockRef.current?.handleSetBodyItems(endpoint.responseBody);
        headerMockRef.current?.handleSetBodyItems(endpoint.responseHeaders);
    }

    useImperativeHandle(ref, () => ({
        setEndpoint,
        openModal,
    }));

    const bodyMockRef = useRef<{ resetBodyItems: () => void, handleSetBodyItems: (responseBody: EndpointBody) => void } | null>(null);
    const headerMockRef = useRef<{ resetBodyItems: () => void, handleSetBodyItems: (responseBody: EndpointBody) => void } | null>(null);

    return (
        <div>
            <dialog id={'modal_3'} className="modal">
                <div className="modal-box">
                    <form onSubmit={handleSubmit}>
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            type="button"
                            onClick={closeModal}
                        >
                            ✕
                        </button>

                        <h3 className="font-bold text-lg">
                        </h3>

                        {/* Campos del formulario */}
                        <div className="py-2">
                            <label htmlFor="name" className="label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="py-2">
                            <label htmlFor="description" className="label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered w-full"
                            />
                        </div>

                        <div className="py-2">
                            <label htmlFor="path" className="label">Path</label>
                            <input
                                type="text"
                                id="path"
                                name="path"
                                placeholder="/api/example/:id"
                                value={formData.path}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="py-2">
                            <label htmlFor="method" className="label">Method</label>
                            <select
                                id="method"
                                name="method"
                                value={formData.method}
                                onChange={handleInputChange}
                                required
                                className="select select-bordered w-full"
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="DELETE">DELETE</option>
                                <option value="PATCH">PATCH</option>
                            </select>
                        </div>

                        <EndpointBodyMock name="responseBody" onBodyItemsChange={handleBodyItemsChange} ref={bodyMockRef} />
                        <EndpointBodyMock name="responseHeaders" onBodyItemsChange={handleBodyItemsChange} ref={headerMockRef} />

                        <div className="py-2">
                            <label htmlFor="statusCode" className="label">Status Code</label>
                            <input
                                type="number"
                                id="statusCode"
                                name="statusCode"
                                value={formData.statusCode}
                                onChange={handleInputChange}
                                required
                                className="input input-bordered w-full"
                                min="100"
                                max="599"
                            />
                        </div>

                        <div className="py-2 flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="checkbox"
                            />
                            <label htmlFor="isActive" className="label ml-2">Active</label>
                        </div>

                        <div className="py-2">
                            <label htmlFor="responseDelay" className="label">Response Delay (ms)</label>
                            <input
                                type="number"
                                id="responseDelay"
                                name="responseDelay"
                                value={formData.responseDelay}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                min="0"
                            />
                        </div>

                        <div className="modal-action">
                            <button type="submit" className="btn">
                                Save endpoint
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
}