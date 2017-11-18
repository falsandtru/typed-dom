import { Diff } from 'spica/data';

type HTMLElementTagNameMap_ = Diff<ElementTagNameMap, Diff<SVGElementTagNameMap, HTMLElementTagNameMap>>;
export { HTMLElementTagNameMap_ as HTMLElementTagNameMap }

declare global {
    interface SVGElementTagNameMap {
        "circle": SVGCircleElement;
        "clippath": SVGClipPathElement;
        "defs": SVGDefsElement;
        "desc": SVGDescElement;
        "ellipse": SVGEllipseElement;
        "feblend": SVGFEBlendElement;
        "fecolormatrix": SVGFEColorMatrixElement;
        "fecomponenttransfer": SVGFEComponentTransferElement;
        "fecomposite": SVGFECompositeElement;
        "feconvolvematrix": SVGFEConvolveMatrixElement;
        "fediffuselighting": SVGFEDiffuseLightingElement;
        "fedisplacementmap": SVGFEDisplacementMapElement;
        "fedistantlight": SVGFEDistantLightElement;
        "feflood": SVGFEFloodElement;
        "fefunca": SVGFEFuncAElement;
        "fefuncb": SVGFEFuncBElement;
        "fefuncg": SVGFEFuncGElement;
        "fefuncr": SVGFEFuncRElement;
        "fegaussianblur": SVGFEGaussianBlurElement;
        "feimage": SVGFEImageElement;
        "femerge": SVGFEMergeElement;
        "femergenode": SVGFEMergeNodeElement;
        "femorphology": SVGFEMorphologyElement;
        "feoffset": SVGFEOffsetElement;
        "fepointlight": SVGFEPointLightElement;
        "fespecularlighting": SVGFESpecularLightingElement;
        "fespotlight": SVGFESpotLightElement;
        "fetile": SVGFETileElement;
        "feturbulence": SVGFETurbulenceElement;
        "filter": SVGFilterElement;
        "foreignobject": SVGForeignObjectElement;
        "g": SVGGElement;
        "image": SVGImageElement;
        "line": SVGLineElement;
        "lineargradient": SVGLinearGradientElement;
        "marker": SVGMarkerElement;
        "mask": SVGMaskElement;
        "metadata": SVGMetadataElement;
        "path": SVGPathElement;
        "pattern": SVGPatternElement;
        "polygon": SVGPolygonElement;
        "polyline": SVGPolylineElement;
        "radialgradient": SVGRadialGradientElement;
        "rect": SVGRectElement;
        "stop": SVGStopElement;
        "svg": SVGSVGElement;
        "switch": SVGSwitchElement;
        "symbol": SVGSymbolElement;
        "text": SVGTextElement;
        "textpath": SVGTextPathElement;
        "tspan": SVGTSpanElement;
        "use": SVGUseElement;
        "view": SVGViewElement;
    }
}
