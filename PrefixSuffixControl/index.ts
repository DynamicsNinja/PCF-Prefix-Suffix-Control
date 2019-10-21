import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class PrefixSuffixControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;
	private _notifyOutputChanged: () => void;

	private _textboxOnChange: EventListenerOrEventListenerObject;
	private _updateSuffix: EventListenerOrEventListenerObject;

	private _textbox: HTMLInputElement;
	private _suffix: HTMLSpanElement;

	private _value: number | null;
	
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;
		this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;

		this._textboxOnChange = this.textboxOnChange.bind(this);
		this._updateSuffix = this.updateSuffix.bind(this);

		this._value = context.parameters.valueField.raw;

		let outerContainer = document.createElement("div");
		outerContainer.classList.add("container");

		let suffixString = context.parameters.suffix.raw || "";

		let textbox = document.createElement("input");
		textbox.addEventListener("change", this._textboxOnChange);
		textbox.addEventListener('input', this._updateSuffix);
		textbox.addEventListener('focus', this._updateSuffix);
		textbox.value =this._value+"";
		textbox.pattern = "[0-9.]";

		let suffix = document.createElement("span");
		suffix.innerHTML = suffixString;
		suffix.classList.add("suffix");
		this._suffix = suffix;

		this._textbox = textbox;
		
		outerContainer.appendChild(textbox);
		outerContainer.appendChild(suffix);

		container.appendChild(outerContainer);

		const width = this.getTextWidth(this._textbox.value);
		this._suffix.style.left = width + 'px';
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
	}

	public getOutputs(): IOutputs
	{
		return {
			valueField: this._value || 0
		};
	}

	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}

	public textboxOnChange():void{
		this._value = this._textbox.value == "" ? null : +this._textbox.value;
		if(this._value == null){
			this._textbox.value = "0";
			const width = this.getTextWidth(this._textbox.value);
			this._suffix.style.left = width + 'px';
		}
		this._notifyOutputChanged();
	}

	public updateSuffix():void {
		const width = this.getTextWidth(this._textbox.value);
		this._suffix.style.left = width + 'px';		
	}

	public getTextWidth(text:string) {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
		context!.font = '600 14px Segoe UI';
		var metrics = context!.measureText(text);
		return metrics.width;
	}
}